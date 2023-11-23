const { encryptPassword, comparePassword } = require('../helpers/handleBcrypt');
const { generateToken } = require('../helpers/generateToken');

const registerUser = async (req, res, Model) => {
    try {
        const newUser = req.body;
        newUser.password = await encryptPassword(newUser.password);

        const createdUser = await Model.create(newUser);
        res.json(createdUser);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const loginUser = async (req, res, Model, errorMessage) => {
    try {
        const { userName, password } = req.body;
        const user = await Model.findOne({ userName });
        if (!user) {
            return res.status(404).send({ message: errorMessage });
        }

        const checkPassword = await comparePassword(password, user.password);
        if (!checkPassword) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        const tokenSession = await generateToken(user);
        res.send({ data: user, token: tokenSession });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

module.exports = { registerUser, loginUser };