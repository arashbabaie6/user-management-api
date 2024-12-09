import * as bcrypt from 'bcrypt';

const roundsOfHashing = 10;

export default async (input) => {
  return await bcrypt.hash(
    input,
    roundsOfHashing,
  );
}