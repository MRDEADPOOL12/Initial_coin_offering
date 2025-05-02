import { DB } from '@database';
import { Meta } from '@interfaces/meta.interface';
import { Op } from 'sequelize';

export async function findMetaData(): Promise<{ [key: string]: string }> {
  const metaValues: Meta[] = await DB.Meta.findAll({
    where: {
      [Op.or]: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
      ]
    },
    attributes: ['meta_name', 'meta_value'],
    raw: true, // Retrieve raw data without Sequelize model instances
  });
  // Map the result to key-value pairs
  const metaDataMap: { [key: string]: string } = {};
  metaValues.forEach((meta: Meta) => {
    metaDataMap[meta.meta_name] = meta.meta_value;
  });
  return metaDataMap; 
}
