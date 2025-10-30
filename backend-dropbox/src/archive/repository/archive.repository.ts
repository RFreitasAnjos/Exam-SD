import { EntityRepository, Repository } from 'typeorm';
import { Archive } from '../archive.entity';

@EntityRepository(Archive)
export class ArchiveRepository extends Repository<Archive> {}