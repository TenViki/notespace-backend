import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "src/entities/tag.entity";
import { Repository } from "typeorm";

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

  async createTag(label: string) {
    const color = this.getRandomColor();
    return this.repo.save({ name: label.toLowerCase(), color: color.finalColor });
  }

  async getTags() {
    return this.repo.find();
  }

  async getTag(label: string) {
    let tag = await this.repo.findOne({ where: { name: label.toLowerCase() } });
    if (!tag) tag = await this.createTag(label);
    return tag;
  }

  getRandomColor(h?: number) {
    const PHI = 0.618033988749895;
    let s, v, hue;
    if (h === undefined) {
      hue = Math.floor(Math.random() * (360 - 0 + 1) + 0) / 360;
      h = (hue + hue / PHI) % 360;
    } else h /= 360;
    v = Math.floor(Math.random() * (100 - 20 + 1) + 20);
    s = (v - 10) / 100;
    v = v / 100;

    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    var finalColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    return {
      h,
      s,
      v,
      r,
      g,
      b,
      finalColor,
    };
  }
}
