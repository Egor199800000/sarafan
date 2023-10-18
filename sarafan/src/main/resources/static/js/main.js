//https://github.com/pagekit/vue-resource информация о Vue-ресурсах
// С помощью такой зависимости можно брать данные которые попадают на серевер по этому Http и уже выводить их в нужных нам Vue-компонентах, используя эту переменную, как мы сделали это в message-list
let messageApi=Vue.resource('/message{/id}');

// это компонент который будет помещаться во внутрь html
// тоесть во внутрь html будут помещаться message-row
// поэтому это тег message row в котором описан цикл v-for 
// в компоненте message-list
Vue.component('message-row',{
    props:['message'],
    template: '<div><i>({{ message.id }})</i> {{ message.text }}</div>'
});


// экземпляр объекта Vue-это компонент
Vue.component('messages-list', {
    props:['messages'],
    // чтобы компонент знал что в него входят данные(массив из объекта Vue)
    // мы указываем их в ключе props
    template:
    '<div>'+
    ' <message-row v-for="message in messages" :key="message.id" :message="message"/>'+
    '</div>', //в цикле будут создаваться строчки message-row-vue компоненты
    // v-for-Vue-дирректива-цикл for
    // message-переменная в которую будут подставляться элементы messages, и выводится значение text
    created: function(){
        messageApi.get().then(result =>
            result.json().then(data =>
                data.forEach(message=>this.messages.push(message)))) //с момощью такой конструкции мы достучались до данных записанных в нашем хранилище благодаря объекту promis
// выведутся данные которые были захардкожены на сервере
    }

});


let app=new Vue({
    el:'#app',
    template: '<messages-list :messages="messages" />', 
//указываем что наш массив messages из ключа data будет называться messages(одноименно)
//Для того чтобы Vue понимал что мы хотим передавть значения в messages из массива messages мы ставим двоеточие
    data: {
        messages: [
  
        ]
    }
})