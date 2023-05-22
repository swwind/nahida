mod basic;
mod bg;
mod fig;

#[macro_export]
macro_rules! story {
  () => {
    nahida_core::story::Story { steps: Vec::new() }
  };
  ($($x:expr),+ $(,)?) => {
    nahida_core::story::Story { steps: vec![$($x),+] }
  };
}

#[macro_export]
macro_rules! steps {
  () => (
    nahida_core::story::StoryStep { actions: Vec::new() }
  );
  ($($x:expr),+ $(,)?) => (
    nahida_core::story::StoryStep { actions: vec![$($x),+] }
  );
}

#[macro_export]
macro_rules! url {
  ($url:expr) => {
    url::Url::parse($url).unwrap()
  };
}
