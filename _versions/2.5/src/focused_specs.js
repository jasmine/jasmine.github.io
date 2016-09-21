/**
 Focusing specs will make it so that they are the only specs that run.
 */

describe("Focused specs", function() {

  /** Any spec declared with `fit` is focused.
   */
  fit("is focused and will run", function() {
    expect(true).toBeTruthy();
  });

  it('is not focused and will not run', function(){
    expect(true).toBeFalsy();
  });

  /** You can focus on a `describe` with `fdescribe`
   *
   */
  fdescribe('focused describe', function(){
    it('will run', function(){
      expect(true).toBeTruthy();
    });

    it('will also run', function(){
      expect(true).toBeTruthy();
    });
  });

  /** If you nest focused and unfocused specs inside `fdescribes`, only focused specs run.
   *
   */
  fdescribe('another focused describe', function(){
    fit("is focused and will run", function() {
      expect(true).toBeTruthy();
    });

    it('is not focused and will not run', function(){
      expect(true).toBeFalsy();
    });
   });
});
