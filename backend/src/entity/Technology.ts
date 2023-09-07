import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, OneToMany, JoinColumn } from "typeorm"
import { isConstructorDeclaration } from "typescript"
import { User } from "./User";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { UserTechnology } from "./UserTechnology";
import { EventTechnology } from "./EventTechnology";

@Entity('technologies')
export class Technology {
    @PrimaryGeneratedColumn({
        name: 'id',
        unsigned: true,
        type: 'int',
        comment: '技術ID',
    })
    id: number;

    @Column('varchar', { length: 256, comment: '技術名' })
    name: string;

    @CreateDateColumn({ comment: '登録日時' })
    readonly created_at?: Timestamp;

    @UpdateDateColumn({ comment: '更新日時' })
    readonly edit_at?: Timestamp;

    @OneToMany(() => EventTechnology, (event_technology) => event_technology.technology, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    readonly event_technologies?: EventTechnology[];

    @OneToMany(() => UserTechnology, (user_technology) => user_technology.technology, {
        createForeignKeyConstraints: false,
        persistence: false,
    })
    readonly user_technologies?: UserTechnology[];
}