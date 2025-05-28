import { AppDataSource } from "../config/datasource";
import { Person } from "../entities/persons.entity";

export class PersonService {
  private personRepository = AppDataSource.getRepository(Person);

  async insert(person: Person) {
    const newPerson = this.personRepository.create(person);
    return await this.personRepository.save(newPerson);
  }

  async getOnePerson(id: number) {
    return await this.personRepository.findOneBy({ id });
  }

  async getAllPersons() {
    return await this.personRepository.find();
  }

  async updatePerson(id: number, updateData: Partial<Person>) {
    await this.personRepository.update(id, updateData);
    return this.getOnePerson(id);
  }

  async deletePerson(id: number) {
    return await this.personRepository.delete(id);
  }
}
