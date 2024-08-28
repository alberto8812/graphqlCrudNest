import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        private readonly itemsService: ItemsService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UsersService

    ) {
        this.isProd = configService.get('STATE') === 'prod'
    }

    async executeSeed() {
        if (this.isProd) {
            throw new UnauthorizedException('We cannat run seed on prod')
        }
        //limpiar la base de datos Borrar todo
        await this.deletedataBase()

        //cargar usuarios
        const user = await this.loadUsers()
        // crear items:

        await this.loadItems(user)

        return true
    }

    async deletedataBase() {
        // borrar los item
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        //borrar los usuario

    }

    async loadUsers(): Promise<User> {

        const users = [];
        for (const user of SEED_USERS) {
            users.push(await this.userService.create(user))
        }
        return users[0]
    }

    async loadItems(user: User): Promise<void> {
        const items = [];
        for (const item of SEED_ITEMS) {
            items.push(await this.itemsService.create(item, user))
        }
    }
}
