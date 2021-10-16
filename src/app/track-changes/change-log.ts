import { Entity, Field, FieldRef, Fields, FieldType, IdEntity, isBackend, Remult } from "remult";

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


export async function recordChanges<entityType extends IdEntity>(remult: Remult, self: entityType, exclude?: (e: Fields<entityType>) => FieldRef<any>[]) {
    if (!self.isNew() && isBackend()) {
        let changes = [] as change[];
        if (!exclude)
            exclude = () => [];
        let excludedFields = exclude(self.$);
        for (const c of [...self.$].filter(c => !excludedFields.includes(c)).filter(c => c.valueChanged())) {
            try {
                let transValue = (val: any) => val;
                if (c.metadata.options.displayValue)
                    transValue = val => c.metadata.options.displayValue!(self, val);
                else if (c.metadata.valueType === Boolean)
                    transValue = val => val ? "V" : "X";


                changes.push({
                    key: c.metadata.key,
                    oldDisplayValue: transValue(c.originalValue),
                    newDisplayValue: transValue(c.value),
                    newValue: (c.value instanceof IdEntity) ? c.value.id : c.value,
                    oldValue: (c.originalValue instanceof IdEntity) ? c.originalValue.id : c.originalValue
                });
            } catch (err) {
                console.log(c);
                throw err;

            }
        }


        if (changes.length > 0) {
            let c = await remult.repo(ChangeLog).findFirst({ where: c => c.relatedId.isEqualTo(self.id), createIfNotFound: true });
            c.changes = [{
                date: new Date(),
                userId: remult.user.id,
                userName: remult.user.name,
                changes
            }, ...c.changes];


            await c.save();
        }

    }
}
