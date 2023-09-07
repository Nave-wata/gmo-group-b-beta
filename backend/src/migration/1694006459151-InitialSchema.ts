import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1694006459151 implements MigrationInterface {
    name = 'InitialSchema1694006459151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`event_speaker\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ユーザー得意技術ID',
                \`created_at\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6),
                \`edit_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`event_id\` int UNSIGNED NULL COMMENT 'イベントID',
                \`user_id\` int UNSIGNED NULL COMMENT 'ユーザーID',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`reservations\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'イベント参加予約ID',
                \`created_at\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6),
                \`edit_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`user_id\` int UNSIGNED NULL COMMENT 'ユーザーID',
                \`event_id\` int UNSIGNED NULL COMMENT 'イベントID',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`event_technology\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ユーザー得意技術ID',
                \`created_at\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6),
                \`edit_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`event_id\` int UNSIGNED NULL COMMENT 'イベントID',
                \`technology_id\` int UNSIGNED NULL COMMENT '技術ID',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user_technology\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ユーザー得意技術ID',
                \`created_at\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6),
                \`edit_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`user_id\` int UNSIGNED NULL COMMENT 'ユーザーID',
                \`technology_id\` int UNSIGNED NULL COMMENT '技術ID',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\` CHANGE \`limitation\` \`limitation\` int NULL COMMENT 'イベント詳細'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`events\` CHANGE \`limitation\` \`limitation\` int NULL COMMENT 'イベント参加人数上限'
        `);
        await queryRunner.query(`
            DROP TABLE \`user_technology\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_technology\`
        `);
        await queryRunner.query(`
            DROP TABLE \`reservations\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_speaker\`
        `);
    }

}
