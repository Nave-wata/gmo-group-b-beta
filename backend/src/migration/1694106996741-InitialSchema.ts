import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1694106996741 implements MigrationInterface {
    name = 'InitialSchema1694106996741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`token\` varchar(1024) NOT NULL COMMENT 'ユーザートークン'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`token\`
        `);
    }

}
