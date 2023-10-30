package letscode.sarafan.controller;

import com.fasterxml.jackson.annotation.JsonView;
import letscode.sarafan.domain.Message;
import letscode.sarafan.domain.Views;
import letscode.sarafan.repo.MessageRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("message")
public class MessageController {

    private final MessageRepo messagesRepo;

    @Autowired
    public MessageController(MessageRepo messages) {
        this.messagesRepo = messages;
    }


    @GetMapping
    @JsonView(Views.IdName.class)//здесь будут выводится сообщ только с id и name
    public List<Message> list(){ //тоесть при запуске приложения мы не будем видеть дату созд уже существ сообщений
        return messagesRepo.findAll();
    }

    //Поиск записи по id
    @GetMapping("{id}")
    @JsonView(Views.FullMessage.class)
    public Message getOne(@PathVariable("id") Message message){
        return message;
    }
//    private Map<String,String> getMessage(@PathVariable String id){
//        return messagesRepo.stream()
//                .filter(message->message.get("id").equalsIgnoreCase(id))
//                .findFirst()
//                .orElseThrow(NotFoundException::new);
//
//    }




    //Добавление нового объекта
    //{"text":"Fourth message"}-формат JSON
//это js-метод для записи в консоли-добавление 4-го сообщения
//fetch('/message', {method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({text: 'Fourth message'})}).then(console.log)
    @PostMapping
    public Message create(@RequestBody Message message){
        message.setCreationDate(LocalDateTime.now());//запихиваем в наше поле теекущую дату
        return messagesRepo.save(message);
    }

    //обновление текущей записи
    //{"text":"rrr","id":"4"}
    //В тестовом режиме попробуем отредактировать сообщение под id=4 дабавив к нему (4)
    //fetch('/message/4', {method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({text: 'Fourth message(4)',id:10})}).then(console.log)
    @PutMapping(value="{id}")
    public Message update(@PathVariable("id") Message messageFromDb,//сообщ получаемое с БД благодаря id которое поступает из URL
                          @RequestBody Message message){ //сообщ получаемое от пользователя-в виде JSON-а
        BeanUtils.copyProperties(message,messageFromDb,"id");//Перекладываем все значения из message в messageFromDb кроме id
        return messagesRepo.save(messageFromDb);
    }

//удаляем сообщение с id=4
//    fetch('/message/4', {method: 'DELETE'}).then(console.log)
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Message message){
messagesRepo.delete(message);
    }




}
