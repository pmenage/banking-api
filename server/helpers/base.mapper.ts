export abstract class BaseMapper<Entity, Domain> {
    abstract entityToDomain(entity: Entity): Domain;

    entityToDomainArray(entities: Entity[]): Domain[] {
        entities = entities.filter(e => e);
        return entities.map(entity => this.entityToDomain(entity));
    }
}
