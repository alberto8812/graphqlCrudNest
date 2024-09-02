import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { ValidRolesArgs } from './dto/args/roles.args';
import { Search, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jw-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enum/valid-rules.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService
  ) { }

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User,
    @Args() paginationArg: PaginationArgs,
    @Args() search: SearchArgs,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles, paginationArg, search);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'updateuser' })
  updatUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user)

  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ) {
    return this.usersService.block(id, user);
  }


  @ResolveField(() => Int, { name: 'itemcount' })
  async itemCount(
    @Parent() user: User // definiomos el padre
  ): Promise<number> {

    return this.itemService.itemCounterByUser(user)

  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() search: SearchArgs,
  ): Promise<Item[]> {
    return this.itemService.findAll(user, paginationArgs, search)
  }
}
