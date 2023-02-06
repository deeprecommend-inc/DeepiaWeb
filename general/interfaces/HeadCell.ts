import { LogDto } from '../../libs/log/session/dto/log.dto';

export interface HeadCell {
    disablePadding: boolean;
    id: keyof LogDto;
    label: string;
    numeric: boolean;
}
