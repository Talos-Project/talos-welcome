import { Plugin } from "./interfaces/Plugin";
import { GitClient } from "./interfaces/GitClient";
import { Config } from "./interfaces/Config";
import { GitProvider } from "./GitProvider";
import { MergeRequestEvent } from "./interfaces/events/MergeRequestEvent";

export default class Welcome implements Plugin<any, Promise<any>> {
  private client: GitClient;

  constructor(config: Config) {
    this.client = GitProvider.getInstance(config.git)
  }

  handle(rx: MergeRequestEvent): Promise<any> {

    if (rx.object_kind !== "merge_request")
      return Promise.resolve()

    if (!rx.object_attributes.action || rx.object_attributes.action !== "open")
      return Promise.resolve()

    const message = `
        Hi @${rx.user.username}! Thanks for your MR.
        Once your changes are ready to be merged type \`/ready-for-review\` so that I can assign reviewers.
    `;

    return this.client.MergeRequestNotes
      .create(rx.project.id, rx.object_attributes.iid, message);
  }

}
