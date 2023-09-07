import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1693976725289 implements MigrationInterface {
    name = 'Init1693976725289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`technologies\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '技術ID',
                \`name\` varchar(256) NOT NULL COMMENT '技術名',
                \`created_at\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6),
                \`edit_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`events\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'イベントID',
                \`name\` varchar(256) NOT NULL COMMENT 'イベント名',
                \`start_time\` timestamp NOT NULL COMMENT '開始日時',
                \`end_time\` timestamp NOT NULL COMMENT '終了日時',
                \`location\` varchar(256) NOT NULL COMMENT '開催場所',
                \`description\` varchar(1024) NULL COMMENT 'イベント詳細',
                \`limitation\` int NULL COMMENT 'イベント詳細',
                \`record_url\` varchar(256) NULL COMMENT '資料URL',
                \`google_calender_event_id\` varchar(1024) NOT NULL COMMENT 'GoogleCalenderEventId',
                \`created_at\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6),
                \`edit_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`create_user_id\` int UNSIGNED NULL COMMENT 'ユーザーID',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ユーザーID',
                \`name\` varchar(256) NOT NULL COMMENT 'ユーザー名',
                \`email\` varchar(256) NOT NULL COMMENT 'メールアドレス',
                \`department\` varchar(256) NOT NULL COMMENT '部署',
                \`created_at\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6),
                \`edit_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`events_genre_technologies\` (
                \`eventsId\` int UNSIGNED NOT NULL,
                \`technologiesId\` int UNSIGNED NOT NULL,
                INDEX \`IDX_3df9e1d1cf85e3cc10f627682d\` (\`eventsId\`),
                INDEX \`IDX_ca5ba94384c343452c4bd7105c\` (\`technologiesId\`),
                PRIMARY KEY (\`eventsId\`, \`technologiesId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users_reservation_events\` (
                \`usersId\` int UNSIGNED NOT NULL,
                \`eventsId\` int UNSIGNED NOT NULL,
                INDEX \`IDX_87319fc9fd8874c61fdf3f9c3b\` (\`usersId\`),
                INDEX \`IDX_bd97a1c1afdf272abceedfcb0b\` (\`eventsId\`),
                PRIMARY KEY (\`usersId\`, \`eventsId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users_speaker_events\` (
                \`usersId\` int UNSIGNED NOT NULL,
                \`eventsId\` int UNSIGNED NOT NULL,
                INDEX \`IDX_78d860839995f392243da8e858\` (\`usersId\`),
                INDEX \`IDX_869f98325c83cdba63cedd2816\` (\`eventsId\`),
                PRIMARY KEY (\`usersId\`, \`eventsId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users_can_use_technologies\` (
                \`usersId\` int UNSIGNED NOT NULL,
                \`technologiesId\` int UNSIGNED NOT NULL,
                INDEX \`IDX_487146da6c605f17e099b07a5a\` (\`usersId\`),
                INDEX \`IDX_5b157e43d3ea4a70c9824b2210\` (\`technologiesId\`),
                PRIMARY KEY (\`usersId\`, \`technologiesId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`events_genre_technologies\`
            ADD CONSTRAINT \`FK_3df9e1d1cf85e3cc10f627682d4\` FOREIGN KEY (\`eventsId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`events_genre_technologies\`
            ADD CONSTRAINT \`FK_ca5ba94384c343452c4bd7105cd\` FOREIGN KEY (\`technologiesId\`) REFERENCES \`technologies\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_reservation_events\`
            ADD CONSTRAINT \`FK_87319fc9fd8874c61fdf3f9c3b5\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_reservation_events\`
            ADD CONSTRAINT \`FK_bd97a1c1afdf272abceedfcb0ba\` FOREIGN KEY (\`eventsId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_speaker_events\`
            ADD CONSTRAINT \`FK_78d860839995f392243da8e8588\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_speaker_events\`
            ADD CONSTRAINT \`FK_869f98325c83cdba63cedd28165\` FOREIGN KEY (\`eventsId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_can_use_technologies\`
            ADD CONSTRAINT \`FK_487146da6c605f17e099b07a5a2\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_can_use_technologies\`
            ADD CONSTRAINT \`FK_5b157e43d3ea4a70c9824b22104\` FOREIGN KEY (\`technologiesId\`) REFERENCES \`technologies\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users_can_use_technologies\` DROP FOREIGN KEY \`FK_5b157e43d3ea4a70c9824b22104\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_can_use_technologies\` DROP FOREIGN KEY \`FK_487146da6c605f17e099b07a5a2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_speaker_events\` DROP FOREIGN KEY \`FK_869f98325c83cdba63cedd28165\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_speaker_events\` DROP FOREIGN KEY \`FK_78d860839995f392243da8e8588\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_reservation_events\` DROP FOREIGN KEY \`FK_bd97a1c1afdf272abceedfcb0ba\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_reservation_events\` DROP FOREIGN KEY \`FK_87319fc9fd8874c61fdf3f9c3b5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`events_genre_technologies\` DROP FOREIGN KEY \`FK_ca5ba94384c343452c4bd7105cd\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`events_genre_technologies\` DROP FOREIGN KEY \`FK_3df9e1d1cf85e3cc10f627682d4\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_5b157e43d3ea4a70c9824b2210\` ON \`users_can_use_technologies\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_487146da6c605f17e099b07a5a\` ON \`users_can_use_technologies\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users_can_use_technologies\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_869f98325c83cdba63cedd2816\` ON \`users_speaker_events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_78d860839995f392243da8e858\` ON \`users_speaker_events\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users_speaker_events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_bd97a1c1afdf272abceedfcb0b\` ON \`users_reservation_events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_87319fc9fd8874c61fdf3f9c3b\` ON \`users_reservation_events\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users_reservation_events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_ca5ba94384c343452c4bd7105c\` ON \`events_genre_technologies\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_3df9e1d1cf85e3cc10f627682d\` ON \`events_genre_technologies\`
        `);
        await queryRunner.query(`
            DROP TABLE \`events_genre_technologies\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`events\`
        `);
        await queryRunner.query(`
            DROP TABLE \`technologies\`
        `);
    }

}
