import { Entity, Field, FieldType, IdEntity } from "remult";

@Entity("changeLog")
export class ChangeLog extends IdEntity {
    @Field()
    relatedId: string = '';
    @Field()
    changes: changeEvent[] = [];
}
export interface changeEvent {
    date: Date,
    userId: string,
    userName: string,
    changes: change[]

}
export interface change {
    key: string;
    oldValue: string;
    oldDisplayValue: string;
    newValue: string;
    newDisplayValue: string;
}