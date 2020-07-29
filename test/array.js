const Order = require('../models/Orders');
Order.find({chat_id:1284779507},(err,data)=>{
    console.log('as');
    console.log(data);
});


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

await Order.findAndModify(
    {chat_id:msg.chat.id},
    {$setOnInsert: {order_list: {name: msg.text, amount: 0} }},
    {new:true, upsert:true},(err)=>{
        bot.sendMessage(msg.chat.id,'Mahsulotni kiriting',{
            reply_markup:{
                remove_keyboard: true
            }
        });
    })