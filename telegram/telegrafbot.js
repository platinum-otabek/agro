const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const Item = require('../models/Items');
let items,updatedAt=new Date(),result=[],isEnter=false,step=1,orderList={},stepId;
const uniqid = require("uniqid");
const allFunc = require('./allFuns');
const Order = require('../models/Orders');
Item.find({},(err,data)=>{
    items = data;
});

module.exports =  ()=>{
    bot.start(async (ctx)=>{
        const newOrder = new Order({
            step:'name',
            chat_id:ctx.update.message.chat.id
        });
        newOrder.save((err)=>{
           if (err)
                console.log(err);
            ctx.reply('Ismingizni kiriting');
        })
    });
    bot.action('order',(ctx)=>{
        console.log(ctx.update.callback_query.from.id);
        const finishOrder = Order.updateOne({
            chat_id: ctx.update.callback_query.from.id
        }, {
            $set: {
                step: 'finish_order'
            }
        });
        finishOrder.then(async ()=>{
            let  branches =[{text:'Bosh ofis'}, {text:'Romitan'}]
            ctx.reply('Qaysi hudud sizga qulay',{
                reply_markup:{
                    keyboard:[branches],
                    resize_keyboard:true
                }
            });
        }).catch((err)=>{
            console.log(err);
        })
    })
    bot.on('inline_query',async (ctx)=>{
        let query = ctx.inlineQuery.query;
        items  =await Item.find({});
        result=[];
            await items.map((element)=>{
              isEnter=true;
              if(element.name.startsWith(query)) {
                  result.push({
                      type:'article',
                      id: element._id,
                      title: element.name,
                      input_message_content: {message_text: element.name, parse_mode: 'HTML'},
                      cache_time:1
                  })
              }
        })
        try {
            ctx.answerInlineQuery(result);
        }catch (e) {
            console.log(e)
        }
    });
    bot.on('message',async (ctx)=>{
        let chatId = ctx.update.message.chat.id;
        let msg = ctx.update.message.text;
       await Order.find({chat_id:chatId},'step',(err,data)=> {
             stepId = data[0].step;
        });
        switch (stepId) {
            case 'name':{
                const updateName = Order.updateOne({
                    chat_id:chatId
                },{
                    $set:{
                        name:ctx.update.message.text,
                        step:'number'
                    }
                });
                updateName.then(()=>{
                    ctx.reply('No`meringizni yuboring',{
                        reply_markup:{
                            keyboard:[
                                [
                                    {
                                        text:'No`merni jo`natish',
                                        request_contact:true
                                    }
                                ]
                            ],
                            resize_keyboard:true,
                            one_time_keyboard:true
                        }
                    })
                }).catch((err) => {
                    console.log(err);
                })
                break;
            }
            case 'number':{
                const updateNumber = Order.updateOne({
                    chat_id: chatId
                }, {
                    $set: {
                        number: ctx.update.message.contact.phone_number,
                        step: 'item_name'
                    }
                });
                updateNumber.then(()=>{
                    ctx.reply('Mahsulot nomini @agrogreenbot yozib kiriting',{
                        reply_markup:{
                            inline_keyboard:[
                                [{text:'@agrogreenbot',switch_inline_query_current_chat:''}],
                            ],
                            remove_keyboard:true
                        }
                    });
                }).catch((err)=>{
                    console.log(err);
                })
                break;
            }
            case 'item_name':{
                let result = items.filter( element => {
                    return ctx.update.message.text.indexOf(element.name) !== -1;
                });
                if(result.length){
                    orderList = {name:ctx.update.message.text,amount:0};
                    const updateItemStep = Order.updateOne({
                        chat_id:chatId
                    },{
                        $set:{
                            step:'item_amount'
                        }
                    });
                    updateItemStep.then(()=>{
                        console.log(orderList);
                        ctx.reply('Miqdorni kiriting');
                    }).catch(()=>{
                        console.log(err);
                    })
                }
                else {
                    ctx.reply('Iltimos mahsulot nomini to`g`ri kiriting');
                }

                break;
            }
            case 'item_amount':{
                orderList.amount = parseInt(ctx.update.message.text) || 0;
                const updateItemStep =await Order.updateOne({
                    chat_id:chatId
                },
                    {$set:{
                        step:'item_name'
                    }
                });
                const addItem = await Order.updateOne({chat_id:chatId},{
                    $push:{
                        order_list:orderList
                    }
                })
                // console.log(orderList);
                ctx.reply('Mahsulotni  kiriting',{
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'@agrogreenbot',switch_inline_query_current_chat:''}],
                            [{text:'Buyurtmalarni to`xtatish',callback_data:'order'}]
                        ],
                        remove_keyboard:true
                    }
                });
                orderList={};
                break;
            }
            case 'finish_order':{
                const sendAllOrders = ['1284779507'];
                let allOrders ='';
                await Order.find({chat_id:ctx.update.message.chat.id},(err,datas)=>{
                    allOrders = `nomer: ${datas[0].number}; hudud: ${ctx.update.message.text} \n \n`
                    datas[0].order_list.forEach((element)=>{
                        if(element.name && element.amount)
                            allOrders = allOrders +  ` ${element.name}: ${element.amount}; \n`;
                    });
                 ctx.reply('Buyurtmangiz qabul qilindi siz bilan tez orada bog`lanamiz',{
                     reply_markup:{
                         remove_keyboard:true 
                     }
                 });
                 ctx.reply('Buyurtma qilish uchun @agrogreenbot yozib nomini kiriting');
                 ctx.telegram.sendMessage(sendAllOrders[0],allOrders,{parse_mode:'HTML'});
                })
                await Order.updateOne({chat_id:chatId},{
                    $set:{
                        order_list:{},
                        step:'item_name',
                    }
                })

            }
        }


    })

    bot.launch();
}