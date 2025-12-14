from app.exceptions.base import ObjectAlreadyExistsError
from app.exceptions.users import UserNotFoundError, UserAlreadyExistsError
from app.schemes.users import SUserAdd, SUserAddRequest, SUserUpdate
from app.schemes.relations_users_roles import SUserGetWithRels
from app.services.base import BaseService
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService(BaseService):

    async def create_user(self, user_data: SUserAddRequest):
        user_for_db = SUserAdd(
            name=user_data.name,
            email=user_data.email,
            hashed_password=pwd_context.hash(user_data.password),
            role_id=user_data.role_id,
            phone_number=user_data.phone_number,
        )
        try:
            await self.db.users.add(user_for_db)
        except ObjectAlreadyExistsError:
            raise UserAlreadyExistsError
        await self.db.commit()

    async def get_user(self, user_id: int):
        user: SUserGetWithRels | None = await self.db.users.get_one_or_none_with_role(
            id=user_id
        )
        if not user:
            raise UserNotFoundError
        return user

    async def edit_user(self, user_id: int, user_data: SUserUpdate):
        user: SUserGetWithRels | None = await self.db.users.get_one_or_none(id=user_id)
        if not user:
            raise UserNotFoundError
        await self.db.users.edit(user_data, id=user_id)
        await self.db.commit()
        return

    async def delete_user(self, user_id: int):
        user: SUserGetWithRels | None = await self.db.users.get_one_or_none(id=user_id)
        if not user:
            raise UserNotFoundError
        await self.db.users.delete(id=user_id)
        await self.db.commit()
        return

    async def get_users(self):
        return await self.db.users.get_all()