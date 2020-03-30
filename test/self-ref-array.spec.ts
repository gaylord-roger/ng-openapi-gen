import {
  InterfaceDeclaration,
  TypescriptParser
} from 'typescript-parser';
import { NgOpenApiGen } from '../lib/ng-openapi-gen';
import options from './self-ref-array.config.json';
import selfRef from './self-ref-array.json';

const gen = new NgOpenApiGen(selfRef, options);
gen.generate();

fdescribe('Generation tests using self-ref-array.json', () => {
  it('Baz model', done => {
    const baz = gen.models.get('Foo.Bar.Baz');
    const ts = gen.templates.apply('model', baz);

    console.warn(ts);

    const parser = new TypescriptParser();
    parser.parseSource(ts).then(ast => {
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(InterfaceDeclaration));
      const decl = ast.declarations[0] as InterfaceDeclaration;
      expect(decl.name).toBe('Baz');
      expect(decl.properties.length).toBe(2);
      const desc = decl.properties.find(p => p.name === 'description');
      expect(desc)
        .withContext('description property')
        .toBeDefined();
      if (desc) {
        expect(desc.type).toBe('string');
      }
      const kids = decl.properties.find(p => p.name === 'childDetails');
      expect(kids)
        .withContext('childDetails property')
        .toBeDefined();
      if (kids) {
        expect(kids.type).toBe('Array<Baz>');
      }

      done();
    });
  });

});
