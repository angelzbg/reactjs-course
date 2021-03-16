import { InfoIcon, IssueOpenedIcon } from '@primer/octicons-react';

const getId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const icons = {
  error: IssueOpenedIcon,
  okay: InfoIcon,
};

export { getId, icons };
