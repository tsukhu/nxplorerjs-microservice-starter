import IUser from '../../api/interfaces/iuser';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';
import container from '../../common/config/ioc_config';

describe('User Service Tests', () => {
  let userService: IUser;

  beforeEach(() => {
    userService = container.get<IUser>(SERVICE_IDENTIFIER.USER);
  });

  it('returns true for valid email and password', () => {
    const result = userService.validateEmailAndPassword(
      'test@email.com',
      'password'
    );
    expect(result).toEqual(true);
  });

  it('returns true for valid email and password', () => {
    const result = userService.findUserIdForEmail('test@email.com');
    expect(result.length).toBeGreaterThan(2);
  });
});
