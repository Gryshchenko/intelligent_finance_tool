import { IGroupDataAccess } from 'interfaces/IGroupDataAccess';
import { IGroupService } from 'interfaces/IGroupService';
import { IGroup } from 'interfaces/IGroup';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';

export default class GroupService implements IGroupService {
    private readonly _accountDataAccess: IGroupDataAccess;

    public constructor(accountDataAccess: IGroupDataAccess) {
        this._accountDataAccess = accountDataAccess;
    }

    public async createGroup(userId: number, groupName: string, trx?: IDBTransaction): Promise<IGroup> {
        return await this._accountDataAccess.createGroup(userId, groupName, trx);
    }
}
