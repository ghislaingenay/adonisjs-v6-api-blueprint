import User from '#models/user'
import invariant from 'tiny-invariant'

export type UserDto = {
  isVerified: boolean
  fullName: string
  email: string
  profilePicture: string
}

export default class UserClient {
  private user
  constructor(user: User) {
    this.user = user
  }

  toJSON(): UserDto {
    invariant(this.user, 'User is not defined')
    return {
      isVerified: Boolean(this.user.isVerified),
      fullName: this.user.fullName ?? '',
      email: this.user.email,
      profilePicture: this.user.profilePicture ?? '',
    }
  }
}
