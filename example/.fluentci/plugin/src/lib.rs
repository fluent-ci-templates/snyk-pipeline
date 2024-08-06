use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup() -> FnResult<String> {
    let home = dag().get_env("HOME")?;
    let path = dag().get_env("PATH")?;
    dag().set_envs(vec![("PATH".into(), format!("{}/.bun/bin:{}", home, path))])?;

    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["bun.sh"])?
        .with_exec(vec!["type node > /dev/null 2>&1 || pkgx install node"])?
        .with_exec(vec!["bun", "install", "-g", "snyk"])?
        .with_exec(vec!["snyk", "--version"])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+nodejs.org",
            "+bun.sh",
            "bunx",
            "snyk",
            "test",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn iac(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("iac test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+nodejs.org",
            "+bun.sh",
            "bunx",
            "snyk",
            "iac",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn code(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("iac test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+nodejs.org",
            "+bun.sh",
            "bunx",
            "snyk",
            "code",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn sbom(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("iac test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+nodejs.org",
            "+bun.sh",
            "bunx",
            "snyk",
            "sbom",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn log4shell(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("iac test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+nodejs.org",
            "+bun.sh",
            "bunx",
            "snyk",
            "log4shell",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn container(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("iac test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+nodejs.org",
            "+bun.sh",
            "bunx",
            "snyk",
            "container",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn iac_test(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("iac test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "+nodejs.org",
            "+bun.sh",
            "bunx",
            "snyk",
            "iac",
            "test",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}
