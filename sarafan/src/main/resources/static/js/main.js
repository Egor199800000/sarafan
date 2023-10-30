//https://github.com/pagekit/vue-resource информация о Vue-ресурсах
// С помощью такой зависимости можно брать данные которые попадают на серевер по этому Http и уже выводить их в нужных нам Vue-компонентах, используя эту переменную, как мы сделали это в message-list
let messageApi=Vue.resource('/message{/id}');
//метод поиска эл по индексу
function getIndex(list,id){
    for(let i=0;i<list.length;i++){
        if(list[i].id===id){
            return i;
        }
    }
    return -1;
}
 
//форма для добавления нового сообщения-она так же будет в компоненте messages-list
Vue.component('message-form',{ 
    props:['messages','messageAttr'],
    data: function(){ //во всех компонентах data-это ф-ия, а иначе на все компоненты будет одна data
        return{
            text:'',
            id:''
        }
    },
    watch:{
        messageAttr:function(newVal,oldVal){//каждый раз когда меняется messageAttr,
                                            //наше watch-выражение будет принимать
                                            //новое значение и старое
            this.text=newVal.text;
            this.id=newVal.id;
        }
    } ,
    template:
    '<div>'+
    //все изменения в этом инпуте попадут в поле text-дирректива; v-model-связывает поле из data и поле ввода
    '<input type="text" placeholder="Write something" v-model="text"/>'+ 
    '<input type="button" value="Save" v-on:click="save"/>'+
    '</div>',
 
    methods:{
save: function(){
let message={text: this.text};
//Сохранение собщения-Post mapping-метод контроллера на сервере;
 
//проверка-изменение старого объекта или добавление нового
if(this.id){
    messageApi.update({id:this.id},message).then(result=>
        result.json().then(data=>{
            let index =getIndex(this.messages,data.id);
            this.messages.splice(index,1,data);//индекс, кол эл на которое хотим заменить,новый элемент
            this.text=''; 
            this.id=''; 
        }));
}else{
    messageApi.save({},message).then(result=>
    result.json().then(data=>{ //берем сообщение с сервера с уст id
        this.messages.push(data); //запихиваем новое сообщ в ключ data-который возвращает text, она сразу выведется благодаря реактивности
        this.text=''; //отчищаем строку ввода
    })
    )};
 
}
    }
 
});
 
// это компонент который будет помещаться во внутрь html
// тоесть во внутрь html будут помещаться message-row
// поэтому это тег message row в котором описан цикл v-for 
// в компоненте message-list
Vue.component('message-row',{
    props:['message','editMethod','messages'],
    template: '<div>'+
    '<i>({{ message.id }})</i> {{ message.text }}'+
    '<span class="mr-button">'+ //кнопка для редактирования сообщений
        '<input type="button" value="Edit" @click="edit" />'+ 
        '<input type="button" value="X" @click="del" />'+ 
    '</span>'+
    '</div>',
    methods: {edit: function(){
// нужно передать message в форму редактирования, для этого пробрасываем
// наш property-message обратно в messages-list который будет передавать его уже в форму,
// В метод editMethod()
this.editMethod(this.message);
    },
    del:function(){//remove и ok -методы из Vue-resources //this.message-обращение к полю текущего компонента находящегося в data-если это переменная, props-если это объект
        messageApi.remove({id: this.message.id}).then(result=>{
            if(result.ok){
                this.messages.splice(this.messages.indexOf(this.message),1);
            }
        })
    }}
});
 
// экземпляр объекта Vue-это компонент
Vue.component('messages-list', {
    props:['messages'],
    // чтобы компонент знал что в него входят данные(массив из объекта Vue)
    // мы указываем их в ключе props
    data: function(){
        return{
            message: null
        }
    },
    template:
    '<div class="messages-list">'+ //messageAttr должен быть в аттррибутах компонента message-form
    ' <message-form :messages="messages" :messageAttr="message"/>'+ //messageAttr должен быть в аттр 
    ' <message-row v-for="message in messages" :key="message.id" :message="message"'+
    ' :editMethod="editMethod" :messages="messages"/>'+
    '</div>', //в цикле будут создаваться строчки message-row-vue компоненты
    // v-for-Vue-дирректива-цикл for
    // message-переменная в которую будут подставляться элементы messages, и выводится значение text
    created: function(){
        messageApi.get().then(result =>
            result.json().then(data =>
                data.forEach(message=>this.messages.push(message)))) //с момощью такой конструкции мы достучались до данных записанных в нашем хранилище благодаря объекту promis
// выведутся данные которые были захардкожены на сервере
    },
 
    methods: {
        editMethod: function(message){ // Метод для редактирования формы
this.message=message; //уст текущий редактируемый метод себе в параметры (ключ data)
    }}
 
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