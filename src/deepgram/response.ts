interface Alternative {
  transcript?: string;
}

interface Channel {
  alternatives?: Alternative[];
}

export interface ResponseData {
  channel?: Channel;
  is_final: boolean;
}
