use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_packages(vec!["snyk"])?
        .with_exec(vec!["snyk", "test", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn iac_test(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("iac test")?
        .pkgx()?
        .with_packages(vec!["snyk"])?
        .with_exec(vec!["snyk", "iac", "test", &args])?
        .stdout()?;
    Ok(stdout)
}
