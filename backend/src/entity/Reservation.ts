import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, ManyToOne, JoinColumn } from "typeorm"
import { isConstructorDeclaration } from "typescript"
import { User } from "./User";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { Event } from "./Event";

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn({
        name: 'id',
        unsigned: true,
        type: 'int',
        comment: 'イベント参加予約ID',
    })
    readonly id: number;

    @ManyToOne(() => User, (user) => user.reservations, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id',
    })
    readonly user?: User;

    @ManyToOne(() => Event, (event) => event.reservations, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    @JoinColumn({
        name: 'event_id',
        referencedColumnName: 'id',
    })
    readonly event?: Event;

    @CreateDateColumn({ comment: '登録日時' })
    readonly created_at?: Timestamp;

    @UpdateDateColumn({ comment: '更新日時' })
    readonly edit_at?: Timestamp;
}