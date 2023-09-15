export type User = {
  id: string;
  profile: {
    color: string;
    name: string;
  };
  position?: {
    x: number;
    y: number;
  };
};
