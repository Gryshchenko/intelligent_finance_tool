import { ICategoryDataAccess } from 'interfaces/ICategoryDataAccess';
import { ICategoryService } from 'interfaces/ICategoryService';
import { ICreateCategory } from 'interfaces/ICreateCategory';
import { ICategory } from 'tenpercent/shared/src/interfaces/ICategory';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { ValidationError } from 'src/utils/errors/ValidationError';
import { validateAllowedProperties } from 'src/utils/validation/validateAllowedProperties';
import Utils from 'src/utils/Utils';

export default class CategoryService extends LoggerBase implements ICategoryService {
    private readonly _categoryDataAccess: ICategoryDataAccess;

    public constructor(accountDataAccess: ICategoryDataAccess) {
        super();
        this._categoryDataAccess = accountDataAccess;
    }

    async create(userId: number, category: ICreateCategory, trx?: IDBTransaction): Promise<ICategory> {
        validateAllowedProperties(category as unknown as Record<string, string | number>, ['categoryName', 'currencyId']);
        const categories = await this._categoryDataAccess.create(userId, [category], trx);
        return categories[0];
    }
    async creates(userId: number, categories: ICreateCategory[], trx?: IDBTransaction): Promise<ICategory[]> {
        return await this._categoryDataAccess.create(userId, categories, trx);
    }
    async patch(userId: number, categoryId: number, properties: Partial<ICategory>, trx?: IDBTransaction): Promise<number> {
        return await this._categoryDataAccess.patch(userId, categoryId, properties, trx);
    }
    async get(userId: number, categoryId: number): Promise<ICategory | undefined> {
        try {
            if (Utils.isNull(categoryId)) {
                throw new ValidationError({ message: 'categoryId cant be null' });
            }
            if (Utils.isNull(userId)) {
                throw new ValidationError({ message: 'userId cant be null' });
            }
            return await this._categoryDataAccess.get(userId, categoryId);
        } catch (e: unknown) {
            this._logger.error(`Fetch category failed due reason: ${(e as { message: string }).message}`);
            throw e;
        }
    }
    async gets(userId: number): Promise<ICategory[] | undefined> {
        return await this._categoryDataAccess.gets(userId);
    }
    async delete(userId: number, categoryId: number, trx?: IDBTransaction): Promise<boolean> {
        return await this._categoryDataAccess.delete(userId, categoryId, trx);
    }
}
