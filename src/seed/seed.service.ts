import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from '../common/adapter/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=1000`,
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segmento = url.split('/');
      const no = +segmento[segmento.length - 2];

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return `Seed executed`;
  }

  // async executeSeed() {
  //   await this.pokemonModel.deleteMany({});

  //   const { data } = await this.axios.get<PokeResponse>(
  //     `https://pokeapi.co/api/v2/pokemon?limit=1000`,
  //   );

  //   const insertPromiseArray = [];

  //   data.results.forEach(({ name, url }) => {
  //     const segmento = url.split('/');
  //     const no = segmento[segmento.length - 2];

  //     // const pokemon = await this.pokemonModel.create({ name, no });

  //     insertPromiseArray.push(this.pokemonModel.create({ name, no }));
  //   });

  //   await Promise.all(insertPromiseArray);

  //   return `Seed executed`;
  // }
}
