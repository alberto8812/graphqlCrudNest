import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

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
        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        private readonly userService: UsersService,
        private readonly listsService: ListsService,
        private readonly listItemService: ListItemService

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

        //crear listas
        const list = await this.loadList(user)
        //crear listItems

        const items = await this.itemsService.findAll(user, { limit: 15, offset: 0 }, {})
        await this.loadListItem(list, items)

        return true
    }

    async deletedataBase() {

        //listItems
        await this.listItemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        //list
        await this.listRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        // borrar los item
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        //borrar los usuario
        await this.userRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()


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

    async loadList(user: User): Promise<List> {
        const lists = []

        for (const list of SEED_LISTS) {
            lists.push(await this.listsService.create(list, user))
        }

        return lists[0]


    }
    async loadListItem(list: List, items: Item[]): Promise<List> {
        const lists = []

        for (const item of items) {
            this.listItemService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1) ? false : true,
                listId: list.id,
                itemId: item.id
            })
        }

        return lists[0]


    }
}
