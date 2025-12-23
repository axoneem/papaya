
import { Stem } from "../Stem";



export class TopicStem extends Stem {
  public readonly kind = 'papaya:stem:topic' as const;

  constructor() {
    super();
  }

  static onEntry() {

  }
}