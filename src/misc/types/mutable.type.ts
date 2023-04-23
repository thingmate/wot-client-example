export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type DeepMutable<T> =
  T extends object
    ? {
      -readonly [P in keyof T]: T[P] extends Array<infer I>
        ? Array<DeepMutable<I>>
        : DeepMutable<T[P]>
    }
    : T
  ;
