import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, ManyToOne, JoinColumn } from "typeorm"
import { isConstructorDeclaration } from "typescript"
import { User } from "./User";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { Technology } from "./Technology";
import { Event } from "./Event";

@Entity('event_speaker')
export class EventSpeaker {
    @PrimaryGeneratedColumn({
        name: 'id',
        unsigned: true,
        type: 'int',
        comment: 'ユーザー得意技術ID',
    })
    readonly id: number;

    @ManyToOne(() => Event, (event) => event.event_speakers, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'event_id',
        referencedColumnName: 'id',
    })
    readonly event?: Event;

    @ManyToOne(() => User, (user) => user.event_speakers, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id',
    })
    readonly user?: User;

    @CreateDateColumn({ comment: '登録日時' })
    readonly created_at?: Timestamp;

    @UpdateDateColumn({ comment: '更新日時' })
    readonly edit_at?: Timestamp;
}