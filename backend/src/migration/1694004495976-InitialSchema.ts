import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1694004495976 implements MigrationInterface {
    name = 'InitialSchema1694004495976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`events\` CHANGE \`limitation\` \`limitation\` int NULL COMMENT 'イベント参加人数上限'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`events\` CHANGE \`limitation\` \`limitation\` int NULL COMMENT 'イベント詳細'
        `);
    }

}
