package letscode.sarafan.domain;

public final class Views {
    //интрефейс для сообщ в которых нужно только id
    public interface Id{}

    //когда мы будем отдавать message через ip с указанием Vue=IdName,
    // мы будем видеть поля которые помечены непосредственно этим интерфейсом
    public interface IdName extends Id{} //интерфейс маркер
    //интрефейс для сообщ в которых нужно только id и name

    //когда мы будем отдавать message через ip с указанием Vue=FullMessage,
    // мы будем видеть поля которые помечены непосредственно
    //Интерфейсом FullMessage и его родительским интерфейсом
    public interface FullMessage extends Id{}
    //интрефейс для сообщ в которых нужны id name и creationDate
}
