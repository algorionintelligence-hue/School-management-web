import { randomBytes } from 'crypto';
const generateBusinessId = () => {
    const randomPart = randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `SCH-${randomPart}`;
};

export default generateBusinessId