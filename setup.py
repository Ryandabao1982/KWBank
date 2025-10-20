from setuptools import setup, find_packages

setup(
    name="kwbank",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "pandas>=2.0.0",
        "click>=8.1.0",
        "pyyaml>=6.0",
    ],
    entry_points={
        "console_scripts": [
            "kwbank=kwbank.cli:main",
        ],
    },
    python_requires=">=3.8",
)
