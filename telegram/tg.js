const Telegram = require('node-telegram-bot-api');
const  bot = new Telegram(process.env.TOKEN,{
    polling:true
});
const Item = require('../models/Items');
const Order = require('../models/Orders');
let data,inlineData=[],updatedAt=new Date(),orderList=[],step=1,orderItem;
Item.find({},(err,users)=>{
    data = users;
});
const geteverydate = ()=>{
    let everynewDate = new Date();
    if(updatedAt.getDay() != everynewDate.getDay()){
        updatedAt = new Date();
        Item.find({},(err,users)=>{
            data = users;
        });
    }
}


module.exports = ()=>{
    bot.on('message',async (msg)=>{
        let result = data.filter( element => {
            return msg.text.indexOf(element.name) !== -1;
        });
        if(step==1 && result.length){
            const isAdded = await Order.find({chat_id:msg.chat.id});
            if(!isAdded.length){
                console.log('isadded')
                const newOrder = new Order({
                    chat_id:msg.chat.id,
                    order_list:{name:msg.text,amount: 0},
                });
                await newOrder.save((err)=>{
                    orderItem = msg.text;
                    bot.sendMessage(msg.chat.id,'Miqdorni kiriting',{
                        reply_markup:{
                            remove_keyboard: true
                        }
                    });
                    step = 2;
                });
            }
            else{
                await Order.updateOne(
                    {chat_id:msg.chat.id},
                    {$push:
                            {order_list:
                                   {name: msg.text, amount: 0}
                            }
                    },
                    (err,data)=>{
                        console.log('is added false');
                        orderItem = msg.text;
                        bot.sendMessage(msg.chat.id,'Miqdorni kiriting',{
                            reply_markup:{
                                remove_keyboard: true
                            }
                        });
                        step = 2;
                })
            }
        }
        else{
            console.log('miqdor');
            Order.updateOne(
                {chat_id:msg.chat.id,'order_list.name':orderItem},
                {
                     $set:{
                         order_list:{name:orderItem,amount:msg.text}
                     }
                },

                (err,data)=>{
                orderItem = '';
                bot.sendMessage(msg.chat.id,'Mahsulotni kiriting',{
                    reply_markup:{
                        remove_keyboard: true
                    }
                });
            });
            step=1;
        }


    });

    bot.on('inline_query', async (query)=>{
       await geteverydate();
        inlineData =[];
          data.forEach( (items)=>{
            if(items.name.startsWith(query.query)){
                inlineData.push([{
                    text: items.name,
                    callback_data:items.name
                }]);
            }
        })
        console.log(inlineData);
        bot.sendMessage(query.from.id,'Mahsulotni tanlang',{
            reply_markup:{
                keyboard:inlineData,
                resize_keyboard:true
            }
        });
         if(!inlineData.length){
            bot.sendMessage(query.from.id,'Mahsulot nomini to`g`ri kiriting',{
                reply_markup:{
                    remove_keyboard:true
                }
            })
        }
    });



    bot.on('polling_error',(err)=>{
        console.log(err);
    })
}