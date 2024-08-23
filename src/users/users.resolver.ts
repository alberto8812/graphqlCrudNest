import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { ValidRolesArgs } from './dto/args/roles.args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs
  ): Promise<User[]> {
    console.log(validRoles)
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  blockUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.block(id);
  }
}
