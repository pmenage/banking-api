export abstract class BaseMapper<Entity, Domain> {
    abstract entityToDomain(entity: Entity): Domain;

    abstract domainToEntity(entity: Entity, domain: Domain): Entity;

    entityToDomainArray(entities: Entity[]): Domain[] {
        entities = entities.filter(e => e);
        return entities.map(entity => this.entityToDomain(entity));
    }
}
