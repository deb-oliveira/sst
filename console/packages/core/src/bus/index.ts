export * as Bus from "./index";

import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { EventBus } from "sst/node/event-bus";
import { useActor } from "../actor";

const client = new EventBridgeClient({});

export interface Events {
  "test.event": {
    foo: string;
  };
}

export type EventName = keyof Events;

export function publish<Name extends EventName>(
  name: Name,
  properties: Events[Name]
) {
  return client.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: EventBus.bus.eventBusName,
          Source: "console",
          Detail: JSON.stringify({
            properties,
            actor: useActor(),
          }),
          DetailType: name,
        },
      ],
    })
  );
}
