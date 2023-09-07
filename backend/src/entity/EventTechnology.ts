import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, ManyToOne, JoinColumn } from "typeorm"
import { isConstructorDeclaration } from "typescript"
import { User } from "./User";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { Technology } from "./Technology";
import { Event } from "./Event";

@Entity('event_technology')
export class EventTechnology {
    @PrimaryGeneratedColumn({
        name: 'id',
        unsigned: true,
        type: 'int',
        comment: 'ユーザー得意技術ID',
    })
    readonly id: number;

    @ManyToOne(() => Event, (event) => event.event_technologies, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'event_id',
        referencedColumnName: 'id',
    })
    event?: Event;

    @ManyToOne(() => Technology, (technology) => technology.event_technologies, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'technology_id',
        referencedColumnName: 'id',
    })
    technology?: Technology;

    @CreateDateColumn({ comment: '登録日時' })
    readonly created_at?: Timestamp;

    @UpdateDateColumn({ comment: '更新日時' })
    readonly edit_at?: Timestamp;
}