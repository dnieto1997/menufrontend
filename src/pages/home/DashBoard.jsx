
export const DashBoard = () => {

    return(
        <>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Dashboard</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <div className="card mb-4">
                        <div className="card-body">
                            <p className="mb-0">
                                This page is an example of using static navigation. By removing the
                                <code>.sb-nav-fixed</code>
                                class from the
                                <code>body</code>
                                , the top navigation and side navigation will become static on scroll. Scroll down this page to see an example.
                            </p>
                        </div>
                    </div>
                    
                    <div className="card mb-4"><div className="card-body">When scrolling, the navigation stays at the top of the page. This is the end of the static navigation demo.</div></div>
                </div>
            </main>
        </>
    );
}