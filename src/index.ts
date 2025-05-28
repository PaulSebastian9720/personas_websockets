import { WebSocket, WebSocketServer } from "ws";
import { PersonService } from "./services/peson.service";
import { Person } from "./entities/persons.entity";
import { AppDataSource } from "./config/datasource";

const wss = new WebSocketServer({ port: 3000 });

const personService = new PersonService();

AppDataSource.initialize()
  .then(() => {
    console.log("Si se levanto");
  })
  .catch((e) => {
    console.log(e);
  });

wss.on("connection", async (ws: WebSocket) => {
  console.log("Cliente conectado");

  const listPerson = await personService.getAllPersons();
  ws.send(JSON.stringify({ type: "persons", data: listPerson }));

  ws.on("message", async (message: string) => {
    try {
      const { type, data } = JSON.parse(message);

      switch (type) {
        case "create":
          await personService.insert(data as Person);
          broadcast({
            type: "persons",
            data: await personService.getAllPersons(),
          });
          break;

        case "update":
          await personService.updatePerson(data.id, data);
          broadcast({
            type: "persons",
            data: await personService.getAllPersons(),
          });
          break;

        case "delete":
          await personService.deletePerson(data.id);
          broadcast({
            type: "persons",
            data: await personService.getAllPersons(),
          });
          break;

        default:
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Tipo de operación no válida",
            })
          );
      }
    } catch (e) {
      console.error("Error procesando mensaje:", e);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Error al procesar el mensaje",
        })
      );
    }
  });
});

function broadcast(message: any) {
  const json = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

console.log("Server se levanto en el puerto 3000");
