const UserType = `
"""
User credentials for login
""" 
type UserType {
    id: String
    """
    User Role
    """
    role: String
    """
    Email
    """
    email: String
    """
    JWT token
    """
    jwt: String
}
`;

export default [UserType];
