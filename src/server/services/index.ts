import * as express from 'express';
import { nameList } from './name.list';
import { historicalData} from './historlical.data'

export function init(app: express.Application) {
    nameList(app);
    historicalData(app);
}
