package letscode.sarafan.controller;

import letscode.sarafan.exception.NotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("message")
public class MessageController {
    private int counter=4;//следующая запись 4

    //Это кастомная БД
    private List<Map<String,String>> messages =new ArrayList<>(){{
        add(new HashMap<String,String>(){{put("id","1");put("text","First message");}});
        add(new HashMap<String,String>(){{put("id","2");put("text","Second message");}});
        add(new HashMap<String,String>(){{put("id","3");put("text","Third message");}});
    }};

    @GetMapping
    public List<Map<String,String>> list(){
        return messages;
    }

    //Поиск записи по id
    @GetMapping("{id}")
    public Map<String,String> getOne(@PathVariable String id){
        return messages.stream()
                .filter(message->message.get("id").equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(NotFoundException::new);

    }




    //Добавление нового объекта
    //{"text":"Fourth message"}-формат JSON
//это js-метод для записи в консоли-добавление 4-го сообщения
//fetch('/message', {method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({text: 'Fourth message'})}).then(console.log)
    @PostMapping
    public Map<String,String> create(@RequestBody Map<String,String> message){
message.put("id",String.valueOf(counter++));
messages.add(message);//добавляем message от пользователя в наш лист
return message;
    }



    private Map<String,String> getMessage(@PathVariable String id){
        return messages.stream()
                .filter(message->message.get("id").equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(NotFoundException::new);

    }
    //обновление текущей записи
    //{"text":"rrr","id":"4"}
    //В тестовом режиме попробуем отредактировать сообщение под id=4 дабавив к нему (4)
    //fetch('/message/4', {method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({text: 'Fourth message(4)',id:10})}).then(console.log)
    @PutMapping(value="{id}")
    public Map<String,String> update(@PathVariable String id,
                                     @RequestBody Map<String,String> message){
        Map<String,String> messageFromCustomDb=getMessage(id);
        messageFromCustomDb.putAll(message);
        messageFromCustomDb.put("id",id);
        return messageFromCustomDb;
    }

//удаляем сообщение с id=4
//    fetch('/message/4', {method: 'DELETE'}).then(console.log)
    @DeleteMapping("{id}")
    public void delete(@PathVariable String id){
        Map<String,String> message=getMessage(id);
        messages.remove(message);
    }




}
